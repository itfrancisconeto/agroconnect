module Api
  module V1
    # Handles product area records exposed through the API.
    #
    # Product areas are returned using an explicit serializer instead of
    # rendering ActiveRecord objects directly. This keeps the API response
    # predictable and avoids exposing unnecessary database fields.
    class ProductAreasController < ApplicationController
      def index
        product_areas = ProductArea.order(:name)

        render json: product_areas.map { |product_area| serialize_product_area(product_area) }
      end
    end
  end
end