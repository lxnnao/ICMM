module ApplicationHelper
	def link_to_add_fields(name, f, association)
		new_object = f.object.send(association).klass.new
		id = new_object.object_id
		fields = f.fields_for(association, new_object, child_index: id) do |builder|
		  render(association.to_s.singularize + "_fields", f: builder)
		end
		link_to(name, '#', class: "add_fields", data: {id: id, fields: fields.gsub("\n", "")})
	end
	def link_to_select(nametext,controllername,actionname,idname)
		if idname.present? then
			link_to nametext, controller: controllername,action: actionname, id: idname
		else
			link_to nametext, controller: controllername,action: actionname
		end
	end
	def link_to_new(controllername)
			link_to_select "new",controllername,"new",nil
	end
	def link_to_edit(controllername,idname)
			link_to_select "edit",controllername,"edit",idname
	end
	def link_to_delete(controllername,idname)
			link_to_select "destroy",controllername,"destroy",idname
	end
end
