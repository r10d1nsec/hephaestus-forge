"""CRUD de proyectos."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from database import get_session
from models.project import Project

router = APIRouter(prefix="/api/projects", tags=["projects"])


class ProjectIn(BaseModel):
    title: str
    raw_idea: str = ""


@router.post("")
def create(body: ProjectIn, db: Session = Depends(get_session)) -> Project:
    project = Project(title=body.title, raw_idea=body.raw_idea)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("")
def list_projects(db: Session = Depends(get_session)) -> list[Project]:
    return list(db.exec(select(Project).order_by(Project.updated_at.desc())).all())


@router.get("/{project_id}")
def get(project_id: str, db: Session = Depends(get_session)) -> Project:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Proyecto no encontrado")
    return project


@router.delete("/{project_id}")
def delete(project_id: str, db: Session = Depends(get_session)) -> dict:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Proyecto no encontrado")
    db.delete(project)
    db.commit()
    return {"deleted": project_id}


def touch(db: Session, project_id: str) -> None:
    """Actualiza updated_at del proyecto."""
    project = db.get(Project, project_id)
    if project:
        project.updated_at = datetime.now(timezone.utc)
        db.add(project)
        db.commit()
