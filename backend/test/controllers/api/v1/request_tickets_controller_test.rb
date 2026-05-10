# frozen_string_literal: true

require "test_helper"

module Api
  module V1
    class RequestTicketsControllerTest < ActionDispatch::IntegrationTest
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

        @ticket = RequestTicket.create!(
          customer: @customer,
          product_area: @product_area,
          title: "Solicitação de sementes",
          description: "Novo pedido de sementes",
          priority: "medium",
          status: "open",
          due_date: Date.current
        )
      end

      test "advances ticket status" do
        patch "/api/v1/request_tickets/#{@ticket.id}/advance_status"

        assert_response :success

        response_body = JSON.parse(response.body)

        assert_equal "in_progress", response_body["status"]
      end

      test "lists request tickets" do
        get "/api/v1/request_tickets"

        assert_response :success

        response_body = JSON.parse(response.body)

        assert_kind_of Array, response_body
        assert_equal @ticket.id, response_body.first["id"]
      end
    end
  end
end