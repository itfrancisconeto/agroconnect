# Represents a product area that can be associated with request tickets.
#
# Product areas work as categories for organizing tickets and must have
# unique names to avoid duplicated classification options.
class ProductArea < ApplicationRecord
  # Prevents deleting a product area while it is still linked to tickets.
  # This preserves ticket history and avoids orphan or inconsistent records.
  has_many :request_tickets, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true
end
