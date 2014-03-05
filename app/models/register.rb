class Register < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_clubregister'
  self.primary_key = 'register_id'
  has_many :clubs,:class_name => 'Register',:primary_key => 'club_id', :foreign_key => "club_id"
  has_many :employees,:class_name => 'Employee',:primary_key => 'emp_id', :foreign_key => "emp_id"
end