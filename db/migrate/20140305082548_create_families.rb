class CreateFamilies < ActiveRecord::Migration
  def change
    create_table :families do |t|
      t.string :family_id
      t.string :family_name
      t.string :family_idcard
      t.string :emp_id
      t.string :is_child
      t.string :m_f
      t.string :name
      t.string :phone
      t.string :email
      t.string :bus_line
      t.datetime :create_time
      t.datetime :update_time

      t.timestamps
    end
  end
end
