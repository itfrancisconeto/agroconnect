# frozen_string_literal: true

require "test_helper"

class CustomerTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    customer = Customer.new(
      name: "Fazenda Boa Safra",
      document: "12.345.678/0001-90",
      customer_type: "rural_producer",
      city: "Cataguases",
      state: "MG"
    )

    assert customer.valid?
  end

  test "is invalid without name" do
    customer = Customer.new(
      document: "12.345.678/0001-90",
      customer_type: "rural_producer",
      city: "Cataguases",
      state: "MG"
    )

    assert_not customer.valid?
  end
end