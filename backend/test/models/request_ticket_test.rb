# frozen_string_literal: true

require "test_helper"

class RequestTicketTest < ActiveSupport::TestCase
  setup do
    @customer = Customer.create!(
      name: "Sítio da Vivi",
      document: "123.456.789-09",
      customer_type: "rural_producer",
      city: "Cataguases",
      state: "MG"
    )

    @product_area = ProductArea.create!(
      name: "Agro Gestão",
      description: "Gestão agrícola"
    )
  end

  test "is valid with required attributes" do
    ticket = RequestTicket.new(
      customer: @customer,
      product_area: @product_area,
      title: "Solicitação de suporte",
      description: "Preciso de ajuda com uma integração",
      priority: "medium",
      status: "open",
      due_date: Date.current
    )

    assert ticket.valid?
  end

  test "is invalid without title" do
    ticket = RequestTicket.new(
      customer: @customer,
      product_area: @product_area,
      description: "Descrição da solicitação",
      priority: "medium",
      status: "open"
    )

    assert_not ticket.valid?
  end

  test "belongs to customer and product area" do
    ticket = RequestTicket.create!(
      customer: @customer,
      product_area: @product_area,
      title: "Solicitação de laboratório",
      description: "Dúvida sobre análise",
      priority: "high",
      status: "open"
    )

    assert_equal @customer, ticket.customer
    assert_equal @product_area, ticket.product_area
  end
end