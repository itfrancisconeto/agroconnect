# Base controller for the API.
#
# Centralizes shared behavior for all API controllers, such as:
# - JSON serialization helpers
# - standardized error handling
# - safe public error responses
#
# The API should not expose internal exception details, validation messages,
# model names, stack traces or database information to the frontend.
# Detailed errors are logged on the server and generic messages are returned
# to the client.
class ApplicationController < ActionController::API
  include ApiSerializers

  rescue_from ActiveRecord::RecordInvalid, with: :render_validation_error
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActionController::ParameterMissing, with: :render_bad_request

  private

  # Handles model validation errors raised by methods such as:
  # - create!
  # - save!
  # - update!
  #
  # Full validation messages are kept only in the server logs to avoid exposing
  # internal field names or business rules through the API response.
  def render_validation_error(error)
    Rails.logger.warn({
      message: "Validation error",
      model: error.record.class.name,
      errors: error.record.errors.full_messages
    }.to_json)

    render json: {
      error: "Não foi possível concluir a operação. Verifique os dados e tente novamente."
    }, status: :unprocessable_entity
  end

  # Handles attempts to access records that do not exist.
  #
  # The original exception message is logged internally, while the API returns
  # a generic 404 response.
  def render_not_found(error)
    Rails.logger.warn({
      message: "Record not found",
      error: error.message
    }.to_json)

    render json: {
      error: "Recurso não encontrado."
    }, status: :not_found
  end

  # Handles malformed requests, such as missing required root parameters.
  #
  # Example:
  # Expected: { customer: { name: "..." } }
  # Received: { name: "..." }
  def render_bad_request(error)
    Rails.logger.warn({
      message: "Bad request",
      error: error.message
    }.to_json)

    render json: {
      error: "A requisição enviada é inválida."
    }, status: :bad_request
  end
end