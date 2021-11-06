#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 fragCoord = gl_FragCoord.xy;
    float t = u_time/2.0;
    float x = (sin(t) + 1.0) / 2.0;
    float y = (cos(t) + 1.0) / 2.0;    
    vec2 res = vec2(500.0, 500.0);


    vec2 ball1 = u_mouse.xy;
    vec2 ball2 = (((res / vec2(1,2)) * vec2(x,y))) + vec2(0, res.y /4.0);
    vec2 ball3 = res / vec2(2,2);
    float s1 = 1.0/length(ball1 - fragCoord);
    float s2 = 1.0/length(ball2 - fragCoord);
    float s3 = 1.0/length(ball3 - fragCoord);
    float s = s1 + s2 + s3;


    vec2 uv = fragCoord/res;
    vec4 color_1 = vec4(0.5 + 0.5*cos(t+uv.xyx+vec3(0,2,4)), 1.0);    
    vec4 color_2 = vec4(0.5 + 0.5*cos(t/2.0+uv.xyx+vec3(0,2,4)), 1.0);
   
    if (s >= 0.03) {
        gl_FragColor = mix(color_1, color_2, s1/s);        
    }
}

