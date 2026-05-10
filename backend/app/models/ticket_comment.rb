# Represents a comment added to a request ticket.
#
# The author name should be assigned by the backend, preferably from the
# authenticated user in a production environment, rather than trusted from
# client-provided parameters.
class TicketComment < ApplicationRecord
  belongs_to :request_ticket

  validates :author_name, :message, presence: true
end
