"""add status column

Revision ID: c4328272dd01
Revises: 4821736333bf
Create Date: 2025-04-09 21:14:49.710899

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4328272dd01'
down_revision: Union[str, None] = '4821736333bf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
