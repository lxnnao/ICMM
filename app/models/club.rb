class Club < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_club'
  self.primary_key = 'club_id'
  has_many :registers,:class_name => 'Register',:primary_key => 'club_id', :foreign_key => "club_id"
  has_many :members,:class_name => 'Employee' ,:through => :registers
end
