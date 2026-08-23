"""vedang-cli — CLI client for veda.ng"""

from importlib.metadata import version, PackageNotFoundError

try:
    __version__ = version("vedang-cli")
except PackageNotFoundError:
    __version__ = "0.1.0"

__author__ = "Vedang Vatsa"
__email__ = "vatsvedang@gmail.com"

from .main import app

__all__ = ["app"]