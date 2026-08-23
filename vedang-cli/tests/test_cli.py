import json
import pytest
from click.testing import CliRunner
from vedang_cli.main import app

runner = CliRunner()


def test_version():
    result = runner.invoke(app, ["--version"])
    assert result.exit_code == 0
    assert "vedang" in result.output.lower()


def test_status():
    # This would need a mock server; skipped for now
    pass


def test_discover_output_format():
    # Test that discover command runs without error (will fail without network)
    result = runner.invoke(app, ["discover", "--format", "json"])
    # Should at least parse args correctly
    assert "Usage" not in result.output or result.exit_code != 2


def test_call_requires_json_arg():
    result = runner.invoke(app, ["call", "search_essays"])
    assert result.exit_code != 0
    assert "Usage" in result.output


def test_call_invalid_json():
    result = runner.invoke(app, ["call", "search_essays", "not valid json"])
    assert result.exit_code != 0