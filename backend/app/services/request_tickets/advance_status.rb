# frozen_string_literal: true

module RequestTickets
  # Service responsible for moving a request ticket to its next workflow status.
  #
  # This class centralizes the status transition rule and keeps controllers
  # focused only on HTTP request/response handling.
  class AdvanceStatus
    STATUS_FLOW = {
      "open" => "in_progress",
      "in_progress" => "waiting_customer",
      "waiting_customer" => "resolved",
      "resolved" => "closed",
      "closed" => "closed"
    }.freeze

    def initialize(ticket)
      @ticket = ticket
    end

    def call
      @ticket.update!(status: next_status)
      @ticket
    end

    private

    def next_status
      STATUS_FLOW.fetch(@ticket.status, @ticket.status)
    end
  end
end