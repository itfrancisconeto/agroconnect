module Api
  module V1
    # Handles comments associated with request tickets.
    #
    # After creating a comment, the controller returns the updated ticket
    # serialized with its related customer, product area and comments.
    class TicketCommentsController < ApplicationController
      def create
        ticket = RequestTicket.find(params[:request_ticket_id])

        ticket.ticket_comments.create!(
          comment_params.merge(
            author_name: "AgroConnect Team",
            internal: false
          )
        )

        # Reloads the ticket with all associations required by the serializer.
        # This ensures the response includes the newly created comment.
        ticket = RequestTicket
          .includes(:customer, :product_area, :ticket_comments)
          .find(ticket.id)

        render json: serialize_ticket(ticket), status: :created
      end

      private

      # Only the comment message is accepted from the frontend.
      #
      # Metadata such as author and internal visibility is controlled by the
      # backend to avoid trusting client-provided values. In a production scenario,
      # these values should come from the authenticated user and their permissions.
      def comment_params
        params.require(:ticket_comment).permit(:message)
      end
    end
  end
end