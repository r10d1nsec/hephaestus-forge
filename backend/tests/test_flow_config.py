"""Tests del flujo de fases, documentos e idioma."""
from __future__ import annotations

from services.generator_service import MVP_DOCUMENTS, _strip_outer_fence
from services.lang import DEFAULT_LANGUAGE, language_name
from services.prompts import load_prompt
from services.wizard_service import PHASE_ORDER


def test_strip_outer_fence():
    assert _strip_outer_fence("```markdown\n# Title\nbody\n```") == "# Title\nbody"
    assert _strip_outer_fence("# Title\nbody") == "# Title\nbody"
    inner = "# T\n```py\nx=1\n```\nmore"
    assert _strip_outer_fence(inner) == inner


def test_five_phase_order():
    assert PHASE_ORDER == ["discovery", "audience", "solution_fit", "scope", "constraints"]


def test_all_phase_prompts_load_and_have_language_slot():
    for phase in PHASE_ORDER:
        tpl = load_prompt(phase)
        assert "{language}" in tpl
        assert "{raw_idea}" in tpl and "{history}" in tpl


def test_blueprint_is_first_and_generators_have_language_slot():
    assert list(MVP_DOCUMENTS)[0] == "blueprint"
    for ref in MVP_DOCUMENTS.values():
        tpl = load_prompt(ref)
        assert "{language}" in tpl


def test_language_name_mapping():
    assert language_name("en") == "English"
    assert language_name("zh") == "中文 (Simplified Chinese)"
    assert language_name(None) == DEFAULT_LANGUAGE
    # nombre desconocido se devuelve tal cual (el frontend ya manda el nombre)
    assert language_name("Klingon") == "Klingon"
