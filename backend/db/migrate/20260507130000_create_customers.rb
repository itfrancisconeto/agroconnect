class CreateCustomers < ActiveRecord::Migration[7.1]
  def change
    create_table :customers do |t|
      t.string :name, null: false
      t.string :document
      t.string :customer_type, null: false
      t.string :city, null: false
      t.string :state, null: false, limit: 2

      t.timestamps
    end
  end
end
