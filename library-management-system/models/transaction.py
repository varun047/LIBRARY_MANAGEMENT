"""Transaction model for library management system."""
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional


class TransactionType(Enum):
    """Enum for transaction types."""
    BORROW = "borrow"
    RETURN = "return"
    FINE_PAYMENT = "fine_payment"


class Transaction:
    """Represents a transaction in the library system."""
    
    def __init__(
        self,
        transaction_id: str,
        user_id: str,
        transaction_type: TransactionType,
        book_id: Optional[str] = None,
        amount: float = 0.0,
        timestamp: Optional[datetime] = None
    ):
        """
        Initialize a Transaction object.
        
        Args:
            transaction_id: Unique identifier for the transaction
            user_id: User involved in the transaction
            transaction_type: Type of transaction
            book_id: Book ID (if applicable)
            amount: Amount involved (for fines/payments)
            timestamp: When the transaction occurred
        """
        self.transaction_id = transaction_id
        self.user_id = user_id
        self.transaction_type = transaction_type
        self.book_id = book_id
        self.amount = amount
        self.timestamp = timestamp or datetime.now()
        self.due_date: Optional[datetime] = None
        
        # Calculate due date for borrows (14 days)
        if transaction_type == TransactionType.BORROW:
            self.due_date = self.timestamp + timedelta(days=14)
    
    def is_overdue(self) -> bool:
        """Check if a borrowed book is overdue."""
        if self.transaction_type == TransactionType.BORROW and self.due_date:
            return datetime.now() > self.due_date
        return False
    
    def get_days_overdue(self) -> int:
        """Get number of days overdue."""
        if self.is_overdue() and self.due_date:
            return (datetime.now() - self.due_date).days
        return 0
    
    def __repr__(self) -> str:
        return f"Transaction(id={self.transaction_id}, type={self.transaction_type.value}, user={self.user_id})"
