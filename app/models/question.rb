class Question < ActiveRecord::Base
	establish_connection("eic_dev")
  	self.table_name = 'im_question'
  	self.primary_key = 'question_id'
	belongs_to :survey,:class_name => 'Survey' ,:primary_key => 'survey_id', :foreign_key => "survey_id"
	has_many :question_answers,:class_name => 'Answer' ,:primary_key => 'question_id', :foreign_key => "question_id",:dependent => :destroy
  	accepts_nested_attributes_for :question_answers,:reject_if => lambda { |a| a[:answer_content].blank?
}, :allow_destroy => true
  before_create do
    self.question_id = self.connection.execute("select EIC.im_question_id_SEQ.nextval id from dual").fetch[0].round
  end
end
