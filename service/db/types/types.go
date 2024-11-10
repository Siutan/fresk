package types

type PerformanceMetrics struct {
	FirstPaint             float64 `json:"firstPaint"`
	FirstContentfulPaint   float64 `json:"firstContentfulPaint"`
	DomLoad                float64 `json:"domLoad"`
	LoadTime               float64 `json:"loadTime"`
}

type Breadcrumb struct {
	Timestamp string                 `json:"timestamp"`
	Category  string                 `json:"category"`
	Message   string                 `json:"message"`
	Data      map[string]interface{} `json:"data"`
}

type CustomData struct {
	Data interface{} `json:"custom"`
}

type StackFrame struct {
	Function string `json:"function"`
	File     string `json:"file"`
	Line     int    `json:"line"`
	Col      int    `json:"col"`
	Raw      string `json:"raw"`
}

type RequestBody struct {
	UserAgent          string             `json:"user_agent"`          	// required
	Language           string             `json:"language"`          	// required
	TimeZone           string             `json:"timezone"`           	// required
	ScreenSize         string             `json:"screen_size"`         	// required
	ViewportSize       string             `json:"viewport_size"`       	// required
	Platform           string             `json:"platform"`           	// required
	BrowserName        string             `json:"browser_name"`        	// required
	BrowserVersion     string             `json:"browser_version"`     	// required
	OsName             string             `json:"os_name"`             	// required
	OsVersion          string             `json:"os_version"`          	// required
	MemoryUsage        int                `json:"memory_usage"`        	// required
	NetworkType        string             `json:"network_type"`        	// required
	AppID              string             `json:"app_id"`             	// required
	AppVersion         string             `json:"app_version"`        	// required
	AppEnvironment     string             `json:"app_environment"`    	// required
	LogType            string             `json:"log_type"`           	// required
	SessionID          string             `json:"session_id"`         	// required
	SessionEmail       string             `json:"session_email"`      	// required
	PageID             string             `json:"page_id"`            	// required
	PageURL            string             `json:"page_url"`           	// required
	SDKVersion         string             `json:"sdk_version"`        	// required
	Time               int64              `json:"time"`               	// required
	Value              string             `json:"value"`              	// Required
	Stacktrace         interface{}        `json:"stacktrace"`         	// optional, can be []StackFrame or string
	Referrer           *string            `json:"referrer"`           	// optional
	PerformanceMetrics PerformanceMetrics `json:"performance_metrics"` 	// optional
	Custom             CustomData         `json:"custom"`             	// optional
	Breadcrumbs        []Breadcrumb       `json:"breadcrumbs"`        	// optional
}