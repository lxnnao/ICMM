class Activity < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_activity'
  self.primary_key = 'activity_id'
  belongs_to :department,:class_name => 'Department',:primary_key => 'department_id', :foreign_key => "department_id"
  belongs_to :contact,:class_name => 'Employee',:primary_key => 'contact_id', :foreign_key => "employee_id"
  belongs_to :operator,:class_name => 'Employee',:primary_key => 'operator', :foreign_key => "employee_id"
end
