class AddEmpBadgeToEmployee < ActiveRecord::Migration
  def change
    add_column :employees, :emp_badge, :string
  end
end
