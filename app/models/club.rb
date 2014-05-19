class Club < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_club'
  self.primary_key = 'club_id'
  has_many :registers,:class_name => 'Register',:primary_key => 'club_id', :foreign_key => "club_id"
  has_many :members,:class_name => 'Employee' ,:through => :registers
  before_create do
    #since we can't use the normal set sequence name we have to set the primary key manually
    #so the execute command return an array of hashes,
    #so we grab the first one and get the nextval column from it and set it on id
    self.club_id = self.connection.execute("select EIC.COMPANY_CLUB_SEQ.nextval id from dual").fetch[0].round
  end
end
