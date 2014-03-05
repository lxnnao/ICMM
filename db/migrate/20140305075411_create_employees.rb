class CreateEmployees < ActiveRecord::Migration
  def change
    create_table :employees do |t|
      t.string :emp_id
      t.string :emp_name
      t.string :emp_phone
      t.string :emp_email
      t.string :emp_familyname
      t.boolean :is_volunteer
      t.string :emp_idcard
      t.datetime :create_time
      t.datetime :update_time

      t.timestamps
    end
  end
end
