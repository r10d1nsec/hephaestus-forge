"""Export de documentos: ZIP (MVP). PDF queda como scaffold del roadmap."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlmodel import Session

from database import get_session
from models.project import Project
from services.export_service import build_zip

router = APIRouter(prefix="/api/projects", tags=["export"])


@router.get("/{project_id}/export/zip")
def export_zip(project_id: str, db: Session = Depends(get_session)) -> Response:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Proyecto no encontrado")
    data = build_zip(db, project_id)
    safe = "".join(c if c.isalnum() else "-" for c in project.title)[:40] or "project"
    return Response(
        content=data,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{safe}-docs.zip"'},
    )
