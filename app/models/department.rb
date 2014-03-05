class Department < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_department'
  self.primary_key = 'department_id'
  has_many :activities,:class_name => 'Activity',:primary_key => 'department_id', :foreign_key => "department_id"
end
