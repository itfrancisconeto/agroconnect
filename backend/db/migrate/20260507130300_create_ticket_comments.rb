class CreateTicketComments < ActiveRecord::Migration[7.1]
  def change
    create_table :ticket_comments do |t|
      t.references :request_ticket, null: false, foreign_key: true
      t.string :author_name, null: false
      t.text :message, null: false
      t.boolean :internal, null: false, default: false

      t.timestamps
    end
  end
end
