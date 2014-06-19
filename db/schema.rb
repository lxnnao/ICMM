# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140523112029) do

  create_table "activities", force: true do |t|
    t.string   "activity_id"
    t.string   "activity_name"
    t.string   "activity_type"
    t.datetime "startdate"
    t.datetime "starttime"
    t.datetime "endtime"
    t.string   "venues"
    t.string   "durringtime"
    t.string   "presenter"
    t.text     "descriptions"
    t.integer  "volunteers"
    t.integer  "attendees"
    t.boolean  "has_award"
    t.string   "department_id"
    t.string   "language_type"
    t.string   "status"
    t.string   "activity_name_eng"
    t.string   "venues_eng"
    t.string   "remark"
    t.string   "contact_id"
    t.string   "operator"
    t.datetime "create_time"
    t.datetime "update_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "answers", force: true do |t|
    t.integer  "question_id"
    t.string   "answer_content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "display_squence"
    t.string   "remark"
    t.string   "content_type"
  end

  create_table "awards", force: true do |t|
    t.string   "award_id"
    t.string   "name"
    t.string   "activity_id"
    t.integer  "qty"
    t.string   "status"
    t.string   "descriptions"
    t.datetime "create_time"
    t.datetime "update_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "clubs", force: true do |t|
    t.string   "club_id"
    t.string   "club_name"
    t.string   "status"
    t.text     "descriptions"
    t.string   "language_type"
    t.string   "operator"
    t.datetime "create_time"
    t.datetime "update_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "departments", force: true do |t|
    t.string   "departmentid"
    t.string   "departmentname"
    t.string   "departmentcode"
    t.datetime "create_time"
    t.datetime "update_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "employees", force: true do |t|
    t.string   "emp_id"
    t.string   "emp_name"
    t.string   "emp_phone"
    t.string   "emp_email"
    t.string   "emp_familyname"
    t.boolean  "is_volunteer"
    t.string   "emp_idcard"
    t.datetime "create_time"
    t.datetime "update_time"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "emp_badge"
  end

  create_table "families", force: true do |t|
    t.string   "family_id"
    t.string   "family_name"
    t.string   "family_idcard"
    t.string   "emp_id"
    t.string   "is_child"
    t.string   "m_f"
    t.string   "name"
    t.string   "phone"
    t.string   "email"
    t.string   "bus_line"
    t.datetime "create_time"
    t.datetime "update_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "questions", force: true do |t|
    t.integer  "survey_id"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "is_required"
    t.string   "content_type"
    t.integer  "display_squence"
  end

  create_table "surveys", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "survey_desciption"
    t.string   "publisher"
    t.datetime "Pubdate"
    t.integer  "TotalReports"
    t.string   "Operater"
    t.string   "Remark"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "badge"
    t.string   "remember_token"
  end

  add_index "users", ["badge"], name: "index_users_on_badge", unique: true
  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
