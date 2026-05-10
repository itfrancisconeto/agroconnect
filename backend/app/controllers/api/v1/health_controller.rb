module Api
  module V1
    # Provides a lightweight health check endpoint for the API.
    #
    # The response intentionally exposes only minimal, non-sensitive information.
    # Avoid returning environment details, database status, version numbers,
    # server paths or internal configuration here.
    class HealthController < ApplicationController
      def show
        render json: { status: "ok", app: "AgroConnect API" }
      end
    end
  end
end
