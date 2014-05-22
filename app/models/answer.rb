class Answer < ActiveRecord::Base
	establish_connection("eic_dev")
  	self.table_name = 'im_answer'
  	self.primary_key = 'answer_id'
	belongs_to :question,:class_name => 'Question' ,:primary_key => 'question_id', :foreign_key => "question_id"

  before_create do
    self.answer_id = self.connection.execute("select EIC.im_answer_id_SEQ.nextval id from dual").fetch[0].round
  end
end
