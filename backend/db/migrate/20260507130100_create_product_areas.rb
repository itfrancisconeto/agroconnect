class CreateProductAreas < ActiveRecord::Migration[7.1]
  def change
    create_table :product_areas do |t|
      t.string :name, null: false
      t.text :description

      t.timestamps
    end

    add_index :product_areas, :name, unique: true
  end
end
