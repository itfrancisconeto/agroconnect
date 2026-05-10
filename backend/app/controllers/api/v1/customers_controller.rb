module Api
  module V1
    # Handles customer records exposed through the API.
    #
    # Responses are serialized explicitly instead of returning ActiveRecord
    # objects directly. This prevents accidental exposure of sensitive or
    # unnecessary fields, such as document, timestamps or future database columns.
    class CustomersController < ApplicationController
      def index
        customers = Customer.order(:name)

        render json: customers.map { |customer| serialize_customer(customer) }
      end

      def create
        customer = Customer.create!(customer_params)

        render json: serialize_customer(customer), status: :created
      end

      def destroy
        customer = Customer.find(params[:id])
        customer.destroy!

        head :no_content
      end

      private

      # Defines which customer attributes can be received from the frontend.
      #
      # Strong Parameters protects the model from mass assignment of fields that
      # should not be controlled by the client.
      def customer_params
        params.require(:customer).permit(
          :name,
          :document,
          :customer_type,
          :city,
          :state
        )
      end
    end
  end
end