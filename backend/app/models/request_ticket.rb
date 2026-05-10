# Represents a support/request ticket created by a customer.
#
# A ticket belongs to a customer and a product area, can receive comments,
# and follows a simple status workflow used by the API.
class RequestTicket < ApplicationRecord
  # Allowed ticket statuses.
  #
  # These values define the lifecycle of a ticket from creation to closure.
  STATUSES = %w[open in_progress waiting_customer resolved closed].freeze

   # Allowed ticket priority levels.
  PRIORITIES = %w[low medium high urgent].freeze

  belongs_to :customer
  belongs_to :product_area

  # Deletes associated comments when the ticket is removed.
  # This prevents orphan comment records.
  has_many :ticket_comments, dependent: :destroy

  validates :title, :description, :status, :priority, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :priority, inclusion: { in: PRIORITIES }

  scope :ordered, -> { order(created_at: :desc) }
end
