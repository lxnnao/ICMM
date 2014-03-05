class CreateDepartments < ActiveRecord::Migration
  def change
    create_table :departments do |t|
      t.string :departmentid
      t.string :departmentname
      t.string :departmentcode
      t.datetime :create_time
      t.datetime :update_time

      t.timestamps
    end
  end
end
