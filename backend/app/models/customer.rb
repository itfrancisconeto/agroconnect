# Represents a customer that can open request tickets in the system.
#
# Customers are classified by business type and may have many associated
# request tickets. When a customer is removed, its related tickets are also
# removed to avoid orphan records.
class Customer < ApplicationRecord
  # Allowed customer categories.
  #
  # Keeping these values centralized avoids accepting arbitrary customer types
  # and makes validation rules easier to maintain.
  CUSTOMER_TYPES = %w[
    rural_producer
    seed_producer
    laboratory
    warehouse
    technical_assistance
    accounting_office
  ].freeze

  # Removes all tickets associated with the customer when the customer is deleted.
  # This prevents orphan ticket records, but should be reviewed if ticket history
  # must be preserved in production.
  has_many :request_tickets, dependent: :destroy

  validates :name, :customer_type, :city, :state, presence: true
  validates :customer_type, inclusion: { in: CUSTOMER_TYPES }
  validates :state, length: { is: 2 }
end
