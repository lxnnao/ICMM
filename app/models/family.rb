class Family < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_family'
  self.primary_key = 'family_id'
  has_one :employee,:class_name => 'Employee' ,:primary_key => 'emp_id', :foreign_key => "emp_id"
end
