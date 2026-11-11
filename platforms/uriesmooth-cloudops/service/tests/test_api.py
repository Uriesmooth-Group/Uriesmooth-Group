import pytest
from fastapi.testclient import TestClient

from cloudops.main import app

client = TestClient(app)


def test_health_is_public_and_minimal():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "uriesmooth-cloudops-api",
    }


def test_ready_is_public():
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_inventory_fails_closed_when_token_not_configured(monkeypatch):
    monkeypatch.delenv("CLOUDOPS_API_TOKEN", raising=False)
    response = client.get("/v1/inventory", headers={"Authorization": "Bearer any"})
    assert response.status_code == 503


def test_inventory_requires_bearer_token(monkeypatch):
    monkeypatch.setenv("CLOUDOPS_API_TOKEN", "test-secret-token")
    response = client.get("/v1/inventory")
    assert response.status_code == 401


def test_inventory_rejects_invalid_token(monkeypatch):
    monkeypatch.setenv("CLOUDOPS_API_TOKEN", "test-secret-token")
    response = client.get(
        "/v1/inventory",
        headers={"Authorization": "Bearer incorrect"},
    )
    assert response.status_code == 401


def test_inventory_returns_safe_unconfigured_snapshot(monkeypatch):
    monkeypatch.setenv("CLOUDOPS_API_TOKEN", "test-secret-token")
    response = client.get(
        "/v1/inventory",
        headers={"Authorization": "Bearer test-secret-token"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["provider"] == "oci"
    assert payload["status"] == "not_configured"
    assert payload["resources"] == []
    assert "generated_at" in payload


def test_inventory_resource_contract_rejects_extra_fields():
    from pydantic import ValidationError
    from cloudops.inventory import InventoryResource

    with pytest.raises(ValidationError):
        InventoryResource(
            resource_id="ocid1.example",
            provider="oci",
            resource_type="compute",
            name="example",
            secret_key="must-not-be-accepted",
        )
