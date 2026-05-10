module Api
  module V1
    # Handles request ticket operations exposed through the API.
    #
    # Tickets are always returned through explicit serializers to keep the
    # response format predictable and avoid exposing unnecessary fields from
    # the ticket itself or from related models.
    class RequestTicketsController < ApplicationController
      def index
        # Eager loads related records used by the serializer.
        # This avoids N+1 queries when rendering customers, product areas
        # and comments for multiple tickets.
        tickets = RequestTicket
          .includes(:customer, :product_area, :ticket_comments)
          .ordered

        tickets = tickets.where(status: params[:status]) if params[:status].present?
        tickets = tickets.where(product_area_id: params[:product_area_id]) if params[:product_area_id].present?

        render json: tickets.map { |ticket| serialize_ticket(ticket) }
      end

      def create
        ticket = RequestTicket.create!(ticket_params)

        # Reloads the ticket with all associations required by the serializer.
        ticket = RequestTicket
          .includes(:customer, :product_area, :ticket_comments)
          .find(ticket.id)

        render json: serialize_ticket(ticket), status: :created
      end

      def update
        ticket = RequestTicket.find(params[:id])
        ticket.update!(ticket_params)

        # Reloads the updated ticket with its related records before rendering.
        ticket = RequestTicket
          .includes(:customer, :product_area, :ticket_comments)
          .find(ticket.id)

        render json: serialize_ticket(ticket)
      end

      def advance_status
        ticket = RequestTicket.find(params[:id])

        # Keeps the status transition rule outside the controller.
        # This makes the business logic easier to test and evolve.
        ::RequestTickets::AdvanceStatus.new(ticket).call

        ticket = RequestTicket
          .includes(:customer, :product_area, :ticket_comments)
          .find(ticket.id)

        render json: serialize_ticket(ticket)
      end

      def destroy
        ticket = RequestTicket.find(params[:id])
        ticket.destroy!

        head :no_content
      end

      private

      # Defines which ticket attributes can be received from the frontend.
      #
      # Strong Parameters prevents clients from mass assigning fields that
      # should not be controlled directly through the API.
      def ticket_params
        params.require(:request_ticket).permit(
          :customer_id,
          :product_area_id,
          :title,
          :description,
          :priority,
          :due_date
        )
      end
    end
  end
end