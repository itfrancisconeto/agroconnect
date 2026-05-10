# Centralizes the JSON serialization rules used by API controllers.
#
# The goal of this concern is to avoid returning ActiveRecord objects directly
# with `render json: model`, which could expose unnecessary or sensitive fields
# if new columns are added to the database in the future.
#
# Each serializer below explicitly defines which attributes are safe to expose
# to the frontend.
module ApiSerializers
  extend ActiveSupport::Concern

  private

  # Serializes customer data exposed by the API.
  #
  # Intentionally does not expose sensitive or unnecessary fields such as:
  # - document
  # - created_at
  # - updated_at
  def serialize_customer(customer)
    {
      id: customer.id,
      name: customer.name,
      customer_type: customer.customer_type,
      city: customer.city,
      state: customer.state
    }
  end

  # Serializes product area data used in ticket forms and listings.
  def serialize_product_area(product_area)
    {
      id: product_area.id,
      name: product_area.name,
      description: product_area.description
    }
  end

  # Serializes public ticket comment data.
  #
  # The `internal` flag is intentionally not exposed here to avoid leaking
  # internal workflow details to the frontend.
  def serialize_ticket_comment(comment)
    {
      id: comment.id,
      author_name: comment.author_name,
      message: comment.message,
      created_at: comment.created_at
    }
  end

  # Serializes a request ticket together with the related data needed by
  # the frontend.
  #
  # This keeps the API response predictable and prevents excessive data exposure
  # from associated models such as customer, product_area and ticket_comments.
  def serialize_ticket(ticket)
    {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      due_date: ticket.due_date,
      customer: serialize_customer(ticket.customer),
      product_area: serialize_product_area(ticket.product_area),
      ticket_comments: ticket.ticket_comments.map do |comment|
        serialize_ticket_comment(comment)
      end
    }
  end
end