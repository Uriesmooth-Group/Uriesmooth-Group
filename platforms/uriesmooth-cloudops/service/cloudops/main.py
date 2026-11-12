"""Uriesmooth CloudOps read-only Inventory MVP API."""
from fastapi import Depends, FastAPI

from cloudops.auth import require_api_token
from cloudops.inventory import empty_snapshot

app = FastAPI(
    title="Uriesmooth CloudOps API",
    summary="Shared cloud operations and deployment governance for Uriesmooth Group.",
    description=(
        "Initial read-only inventory API foundation. Provider integrations are "
        "disabled until their identities and permissions have been reviewed."
    ),
    version="0.1.0",
)


@app.get("/health", tags=["operations"])
def health() -> dict[str, str]:
    """Liveness probe; deliberately contains no infrastructure details."""
    return {"status": "ok", "service": "uriesmooth-cloudops-api"}


@app.get("/ready", tags=["operations"])
def ready() -> dict[str, str]:
    """Readiness probe for the stateless API foundation."""
    return {"status": "ready"}


@app.get(
    "/v1/inventory",
    tags=["inventory"],
    dependencies=[Depends(require_api_token)],
)
def get_inventory():
    """Return a safe empty snapshot until a reviewed read-only adapter is enabled."""
    return empty_snapshot()
