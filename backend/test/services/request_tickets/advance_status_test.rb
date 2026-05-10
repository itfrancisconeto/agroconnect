# frozen_string_literal: true

require "test_helper"

module RequestTickets
  class AdvanceStatusTest < ActiveSupport::TestCase
    setup do
      @customer = Customer.create!(
        name: "Fazenda Boa Safra",
        document: "12.345.678/0001-90",
        customer_type: "rural_producer",
        city: "Cataguases",
        state: "MG"
      )

      @product_area = ProductArea.create!(
        name: "Agro Sementes",
        description: "Gestão de sementes"
      )
    end

    test "moves ticket from open to in_progress" do
      ticket = create_ticket(status: "open")

      result = AdvanceStatus.new(ticket).call

      assert_equal "in_progress", result.status
    end

    test "moves ticket from in_progress to waiting_customer" do
      ticket = create_ticket(status: "in_progress")

      result = AdvanceStatus.new(ticket).call

      assert_equal "waiting_customer", result.status
    end

    test "moves ticket from waiting_customer to resolved" do
      ticket = create_ticket(status: "waiting_customer")

      result = AdvanceStatus.new(ticket).call

      assert_equal "resolved", result.status
    end

    test "moves ticket from resolved to closed" do
      ticket = create_ticket(status: "resolved")

      result = AdvanceStatus.new(ticket).call

      assert_equal "closed", result.status
    end

    test "keeps closed ticket as closed" do
      ticket = create_ticket(status: "closed")

      result = AdvanceStatus.new(ticket).call

      assert_equal "closed", result.status
    end

    private

    def create_ticket(status:)
      RequestTicket.create!(
        customer: @customer,
        product_area: @product_area,
        title: "Solicitação de sementes",
        description: "Novo pedido de sementes",
        priority: "medium",
        status: status,
        due_date: Date.current
      )
    end
  end
end