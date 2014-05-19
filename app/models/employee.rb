class Employee < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_employee'
  self.primary_key = 'emp_id'

  belongs_to :activities,:class_name => 'Activity',:primary_key => 'emp_id', :foreign_key => "contact_id"
  has_many :Registers,:class_name => 'Register',:primary_key => 'emp_id', :foreign_key => "emp_id"
  has_many :clubs,:class_name => 'Club' ,:through => :registers
  has_many :household,:class_name => 'Family' ,:primary_key => 'emp_id', :foreign_key => "emp_id"

  before_create do
    #since we can't use the normal set sequence name we have to set the primary key manually
    #so the execute command return an array of hashes,
    #so we grab the first one and get the nextval column from it and set it on id
    self.emp_id = self.connection.execute("select EIC.EMP_SYS_ID_SEQ.nextval id from dual").fetch[0].round
  end
end
