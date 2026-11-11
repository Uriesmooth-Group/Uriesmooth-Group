"""Provider-neutral, read-only inventory contract."""
from datetime import datetime, timezone
from typing import Literal, Protocol

from pydantic import BaseModel, ConfigDict, Field


class InventoryResource(BaseModel):
    model_config = ConfigDict(extra="forbid")

    resource_id: str = Field(min_length=1, max_length=256)
    provider: Literal["oci", "aws", "azure", "gcp", "local"]
    resource_type: str = Field(min_length=1, max_length=120)
    name: str = Field(min_length=1, max_length=256)
    region: str | None = Field(default=None, max_length=100)
    lifecycle_state: str | None = Field(default=None, max_length=100)


class InventorySnapshot(BaseModel):
    model_config = ConfigDict(extra="forbid")

    generated_at: datetime
    provider: Literal["oci", "aws", "azure", "gcp", "local"]
    status: Literal["available", "not_configured"]
    resources: list[InventoryResource] = Field(default_factory=list)


class InventoryProvider(Protocol):
    """Read-only adapter contract. Implementations must not mutate provider state."""

    provider_name: str

    def list_resources(self) -> list[InventoryResource]:
        """Return sanitized resource metadata only."""


def empty_snapshot(provider: str = "oci") -> InventorySnapshot:
    """Return an explicit no-provider-connected response, never fabricated resources."""
    return InventorySnapshot(
        generated_at=datetime.now(timezone.utc),
        provider=provider,
        status="not_configured",
        resources=[],
    )
