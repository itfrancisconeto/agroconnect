# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_05_07_130300) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "customers", force: :cascade do |t|
    t.string "name", null: false
    t.string "document"
    t.string "customer_type", null: false
    t.string "city", null: false
    t.string "state", limit: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "product_areas", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_product_areas_on_name", unique: true
  end

  create_table "request_tickets", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.bigint "product_area_id", null: false
    t.string "title", null: false
    t.text "description", null: false
    t.string "priority", default: "medium", null: false
    t.string "status", default: "open", null: false
    t.date "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_request_tickets_on_customer_id"
    t.index ["priority"], name: "index_request_tickets_on_priority"
    t.index ["product_area_id"], name: "index_request_tickets_on_product_area_id"
    t.index ["status"], name: "index_request_tickets_on_status"
  end

  create_table "ticket_comments", force: :cascade do |t|
    t.bigint "request_ticket_id", null: false
    t.string "author_name", null: false
    t.text "message", null: false
    t.boolean "internal", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["request_ticket_id"], name: "index_ticket_comments_on_request_ticket_id"
  end

  add_foreign_key "request_tickets", "customers"
  add_foreign_key "request_tickets", "product_areas"
  add_foreign_key "ticket_comments", "request_tickets"
end
