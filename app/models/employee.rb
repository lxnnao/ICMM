class Employee < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_employee'
  self.primary_key = 'emp_id'
  has_many :activities,:class_name => 'Activity',:primary_key => 'department_id', :foreign_key => "department_id"
  has_many :Registers,:class_name => 'Register',:primary_key => 'emp_id', :foreign_key => "emp_id"
  has_many :clubs,:class_name => 'Club' ,:through => :registers
  has_many :household,:class_name => 'Family' ,:primary_key => 'emp_id', :foreign_key => "emp_id"
end
