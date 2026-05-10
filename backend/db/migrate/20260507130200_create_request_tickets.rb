class CreateRequestTickets < ActiveRecord::Migration[7.1]
  def change
    create_table :request_tickets do |t|
      t.references :customer, null: false, foreign_key: true
      t.references :product_area, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description, null: false
      t.string :priority, null: false, default: "medium"
      t.string :status, null: false, default: "open"
      t.date :due_date

      t.timestamps
    end

    add_index :request_tickets, :status
    add_index :request_tickets, :priority
  end
end
