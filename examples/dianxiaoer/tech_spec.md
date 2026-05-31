# Technical Spec — 小餐馆多平台订单聚合 + AI 备货预测小程序

## Recommended Stack

| 层 | 技术选型 | 理由（基于真实场景） |
|----|---------|---------------------|
| 前端 | **微信小程序原生 + TDesign 组件库** | 用户是 30–50 岁、不懂技术的店主，只在手机操作。小程序免安装、微信登录天然，原生框架性能最稳。订单聚合界面信息密度高，TDesign 比 Vant 更贴合 B 端表格/列表。不上 uni-app：跨端不是需求（明确不做 PC），多一层抽象只增加调试成本。 |
| 后端 | **Python (FastAPI) + Celery** | 核心价值是「订单同步」和「AI 预测」两个异步任务。FastAPI 写 webhook 回调和 REST 快、类型清晰；Celery 跑定时拉单和每日预测计算。Python 生态对预测模型（statsmodels / Prophet）最友好。 |
| 数据库 | **PostgreSQL + Redis** | 订单/库存是强一致的交易数据，需要事务和 JOIN（销售日报靠聚合查询）→ Postgres。Redis 做平台 token 缓存、低库存提醒去重、拉单任务队列。1–3 家店的数据量，单实例 Postgres 绰绰有余，不需要分库。 |
| AI 预测 | **Prophet / 加权移动平均（起步）+ 单一 LLM 供应商** | ⚠️ 见下方风险。备货预测本质是时间序列问题，**不应该用 LLM 算数量**。LLM 用于「生成自然语言备货建议解释」和「异常归因」，预测数字交给统计模型。 |
| 部署 | **Docker Compose 单机 / 轻量云服务器** | 体量小，微服务是过度设计。 |

---

## Architecture Overview

```
                    ┌─────────────────────────┐
                    │   微信小程序 (店主端)      │
                    │  订单聚合 / 库存 / 日报    │
                    └───────────┬─────────────┘
                                │ HTTPS (JWT)
                    ┌───────────▼─────────────┐
                    │      FastAPI 网关         │
                    │  鉴权 / 业务 API / SSE推送 │
                    └─────┬──────────────┬─────┘
                          │              │
              ┌───────────▼──┐    ┌──────▼───────────┐
              │ PostgreSQL   │    │  Redis (队列/缓存) │
              │ 订单/库存/销量 │    └──────┬───────────┘
              └──────────────┘           │
                          ▲              │
              ┌───────────┴──────────────▼──────────┐
              │           Celery Workers             │
              │  ① 定时拉单 / webhook 处理            │
              │  ② 每日预测任务 (统计模型)            │
              │  ③ 低库存检测 → 微信订阅消息          │
              └──────┬──────────────────────┬────────┘
                     │                      │
        ┌────────────▼─────────┐   ┌────────▼────────┐
        │ 外卖平台 API 适配层    │   │  LLM 供应商      │
        │ 美团/饿了么 (适配器)   │   │ (建议文案生成)   │
        └──────────────────────┘   └─────────────────┘
```

**说明：** 每个外卖平台封装为独立**适配器（Adapter）**，统一输出内部订单模型，屏蔽各平台字段差异。订单获取优先用**平台主动推送（webhook）**，辅以**定时轮询兜底**（防止漏单）。预测任务每日凌晨跑一次，结果落库供小程序读取。

---

## Data Model

```
merchants (店主)
  id, wx_openid, wx_unionid, phone, created_at

shops (门店, 一个店主 1–N 家)
  id, merchant_id→merchants, name, address

platform_bindings (门店↔平台授权)
  id, shop_id→shops, platform(meituan|eleme), 
  shop_external_id, access_token(加密), refresh_token(加密), 
  token_expires_at, status

orders (聚合订单)
  id, shop_id→shops, platform, external_order_id(唯一),
  status, total_amount, placed_at, raw_payload(jsonb)
  UNIQUE(platform, external_order_id)   ← 幂等去重

order_items (订单明细)
  id, order_id→orders, dish_name, sku_id→skus(可空), qty, price

skus (库存单元 / 食材或菜品)
  id, shop_id→shops, name, unit, current_stock, 
  low_stock_threshold

stock_movements (库存流水)
  id, sku_id→skus, change, reason(sale|restock|adjust|spoilage), 
  related_order_id, created_at

prep_suggestions (每日备货建议)
  id, shop_id→shops, sku_id→skus, suggest_date, 
  predicted_qty, confidence, llm_explanation, model_version

daily_reports (销售日报)
  id, shop_id→shops, report_date, order_count, 
  revenue, top_dishes(jsonb)
```

**关系核心：** `merchant 1—N shop 1—N {orders, skus}`。`order_items.sku_id` 是预测的关键映射——只有把平台菜品名关联到内部 SKU，才能把销量转成备货量。**这是整个产品最脆弱的环节**（见风险）。

---

## API Endpoints

```
# 鉴权
POST /api/auth/wx-login              微信 code 换 session + JWT

# 门店与绑定
GET    /api/shops
POST   /api/shops/{id}/bindings      发起平台 OAuth 授权
DELETE /api/shops/{id}/bindings/{bid}

# 订单聚合
GET  /api/orders?shop_id&platform&status&date   聚合视图（分页）
GET  /api/orders/stream                          SSE 实时新订单推送

# 平台回调（无鉴权，验签）
POST /api/webhooks/meituan
POST /api/webhooks/eleme

# 库存
GET   /api/skus?shop_id
PATCH /api/skus/{id}                 改库存/阈值
POST  /api/skus/{id}/restock         补货

# AI 备货建议
GET  /api/prep-suggestions?shop_id&date

# 销售日报
GET  /api/reports/daily?shop_id&date
```

---

## External Integrations

1. **外卖平台 API（美团开放平台 / 饿了么商家开放平台）**
   - 接入方式：商家 OAuth 授权 → 拿到门店级 token → 拉取订单 + 订阅推送。
   - 用途：订单同步（核心）、菜品信息。
2. **微信小程序生态**
   - 登录：`wx.login` → code2session。
   - 推送：**订阅消息（subscribe_message）** 用于低库存/备货提醒（注意：一次授权只能推一次，需引导用户重复授权）。
3. **LLM 供应商（单一）**
   - 仅用于把统计模型的预测数字转成店主能看懂的中文建议，不做核心数值计算。

---

## Security Considerations

- **平台 token 加密存储**：`access_token / refresh_token` 用 KMS 或应用层 AES 加密入库，绝不明文，绝不出现在日志或 API 响应。
- **Webhook 验签 + 幂等**：所有平台回调必须验证签名；`UNIQUE(platform, external_order_id)` 防重复入账。
- **多租户隔离**：每个 API 强制校验 `shop_id` 归属当前 `merchant`，防止越权读他人订单（B 端最常见漏洞）。
- **JWT 短期 + 刷新**：小程序态长，access token 短期 + refresh 机制。
- **最小权限 OAuth**：只申请订单读取所需 scope。
- **PII**：订单含顾客手机号/地址，日报和导出做脱敏，遵守个保法。

---

## Deployment Strategy

- **起步**：单台云服务器（4C8G 足够 1–3 店量级）+ Docker Compose：`fastapi`、`celery-worker`、`celery-beat`、`postgres`、`redis`、`nginx`(TLS)。
- **CI/CD**：GitHub Actions → 构建镜像 → SSH 部署。
- **备份**：Postgres 每日 dump + 异地存储（订单是生意命脉）。
- **监控**：拉单失败率、webhook 验签失败、预测任务耗时；告警发到店主无关的运维渠道。
- **扩展路径**：门店增多时，先垂直扩容，再把 Celery worker 独立横向扩展，最后才考虑读写分离。**不要一上来上 K8s。**

---

## ⚠️ 关键技术风险（必须正视）

1. **外卖平台 API 准入是最大不确定性。** 美团/饿了么的开放平台对第三方 ISV 有资质审核、类目限制和审核周期，**不是注册就能调**。若拿不到正式接口，备选（爬虫/模拟登录）违反平台协议且极易封号——**这关系到产品能否成立，应在写代码前先验证准入**。
2. **菜品名 → SKU 映射难做。** 各平台同一道菜命名不一致、有套餐/规格，自动映射准确率有限。MVP 阶段建议**人工确认映射**，否则预测全盘失真。
3. **AI 预测在冷启动期不可靠。** 新店无历史数据、节假日/天气/促销造成剧烈波动。MVP 用**加权移动平均**起步即可，别承诺高精度；把预测定位为「参考建议」而非「保证」，并展示置信度，管理店主预期。
4. **订阅消息触达受限。** 微信订阅消息单次授权单次推送，低库存提醒的及时触达体验会打折，需在交互上反复引导授权。
