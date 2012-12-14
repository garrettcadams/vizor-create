E2.p = E2.plugins["vector_transform"] = function(core, node)
{
	this.desc = 'Transform a vector by the supplied matrix.';
	
	this.input_slots = [ 
		{ name: 'vector', dt: core.datatypes.VECTOR, desc: 'Input vector to transform.', def: '0, 0, 0' },
		{ name: 'matrix', dt: core.datatypes.MATRIX, desc: 'Transformation matrix to multiply the vector by.', def: 'Identity' } 
	];
	
	this.output_slots = [
		{ name: 'vector', dt: core.datatypes.VECTOR, desc: 'Emits the transformed input vector.', def: '0, 0, 0' }
	];
};

E2.p.prototype.update_input = function(slot, data)
{
	if(slot.index === 0)
		this.vector = data;
	else if(slot.index === 1)
		this.matrix = data;
};	

E2.p.prototype.update_state = function(delta_t)
{
	mat4.multiplyVec3(this.matrix, this.vector, this.transformed);
};

E2.p.prototype.update_output = function(slot)
{
	return this.transformed;
};	

E2.p.prototype.state_changed = function(ui)
{
	if(!ui)
	{
		this.vector = [0, 0, 0];
		this.transformed = [0, 0, 0];
		this.matrix = mat4.create();
		
		mat4.identity(this.matrix);
	}
};
