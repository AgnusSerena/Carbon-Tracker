"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, ExternalLink, Terminal, Code, Settings, Activity, Download } from "lucide-react"

export function CodeCarbonSetup() {
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true)

  // Check current demo mode status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/codecarbon/projects")
        const data = await response.json()
        setIsDemoMode(data.isMockData || false)
      } catch (error) {
        console.error("Error checking status:", error)
      }
    }
    checkStatus()
  }, [apiKey])

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand("copy")
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (fallbackErr) {
          console.error("Fallback copy failed: ", fallbackErr)
        }
        document.body.removeChild(textArea)
      })
  }

  const handleDownloadFile = (content: string, filename: string, contentType = "text/plain") => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const installationCode = `# Install Code Carbon
pip install codecarbon

# Or with conda
conda install -c conda-forge codecarbon`

  const pythonExample = `from codecarbon import EmissionsTracker

# Initialize tracker
tracker = EmissionsTracker(
    project_name="my-project",
    api_call=True,
    api_endpoint="https://api.codecarbon.io",
    api_key="${apiKey || "YOUR_API_KEY"}"
)

# Start tracking
tracker.start()

# Your code here
def my_function():
    # CPU intensive task
    result = sum(i**2 for i in range(1000000))
    return result

result = my_function()

# Stop tracking
emissions = tracker.stop()
print(f"Emissions: {emissions} kg CO2")`

  const decoratorExample = `from codecarbon import track_emissions

@track_emissions(
    project_name="my-project",
    api_call=True,
    api_key="${apiKey || "YOUR_API_KEY"}"
)
def carbon_intensive_function():
    # Your code here
    return "Hello, sustainable world!"

# Function will automatically track emissions
result = carbon_intensive_function()`

  const cliExample = `#!/bin/bash

# Track emissions for any command
codecarbon monitor --api_call --project_name "my-project" --api_key "${apiKey || "YOUR_API_KEY"}" -- python my_script.py

# Or use environment variables
export CODECARBON_API_KEY="${apiKey || "YOUR_API_KEY"}"
export CODECARBON_PROJECT_NAME="my-project"
codecarbon monitor --api_call -- python my_script.py`

  const requirementsContent = `# Code Carbon requirements
codecarbon>=2.3.0
requests>=2.25.0
psutil>=5.8.0
py-cpuinfo>=8.0.0`

  const configExample = `# codecarbon.config
[codecarbon]
api_endpoint = https://api.codecarbon.io
api_key = ${apiKey || "YOUR_API_KEY"}
project_name = my-project
save_to_api = true
save_to_file = true
output_dir = ./emissions
output_file = emissions.csv
log_level = INFO
tracking_mode = machine`

  const dockerExample = `# Dockerfile for Code Carbon tracking
FROM python:3.9-slim

# Install Code Carbon
RUN pip install codecarbon

# Set environment variables
ENV CODECARBON_API_KEY="${apiKey || "YOUR_API_KEY"}"
ENV CODECARBON_PROJECT_NAME="my-project"

# Copy your application
COPY . /app
WORKDIR /app

# Install dependencies
RUN pip install -r requirements.txt

# Run with Code Carbon monitoring
CMD ["codecarbon", "monitor", "--api_call", "--", "python", "app.py"]`

  const CodeBlock = ({
    code,
    filename,
    language = "python",
    onCopy,
    onDownload,
  }: {
    code: string
    filename: string
    language?: string
    onCopy: () => void
    onDownload: () => void
  }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
        <span className="text-sm font-mono">{filename}</span>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0" onClick={onCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <pre className="bg-gray-100 p-4 rounded-b-lg text-sm overflow-x-auto border-t-0">
        <code>{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Code Carbon Setup</span>
          </CardTitle>
          <CardDescription>
            Configure Code Carbon to automatically track emissions from your development environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isDemoMode && (
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  Currently showing demo data. Enter your Code Carbon API key below to connect to real tracking data.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Code Carbon API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button variant="outline" size="sm" asChild>
                  <a href="https://codecarbon.io" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Get your API key from{" "}
                <a href="https://codecarbon.io" className="text-blue-600 hover:underline">
                  codecarbon.io
                </a>{" "}
                or leave empty to continue with demo data
              </p>
            </div>

            {apiKey && (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  API key configured! You can now use the examples below to start tracking emissions.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  const allFiles = [
                    { content: installationCode, filename: "install_codecarbon.sh" },
                    { content: pythonExample, filename: "emissions_tracker_example.py" },
                    { content: decoratorExample, filename: "decorator_example.py" },
                    { content: cliExample, filename: "cli_monitoring.sh" },
                    { content: requirementsContent, filename: "requirements.txt" },
                    { content: configExample, filename: "codecarbon.config" },
                    { content: dockerExample, filename: "Dockerfile" },
                  ]

                  // Create a zip-like structure by downloading all files
                  allFiles.forEach((file, index) => {
                    setTimeout(() => {
                      handleDownloadFile(file.content, file.filename)
                    }, index * 100) // Small delay between downloads
                  })
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download All Examples
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="installation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="python">Python API</TabsTrigger>
          <TabsTrigger value="decorator">Decorator</TabsTrigger>
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="docker">Docker</TabsTrigger>
        </TabsList>

        <TabsContent value="installation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5" />
                <span>Installation</span>
              </CardTitle>
              <CardDescription>Install Code Carbon in your development environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CodeBlock
                  code={installationCode}
                  filename="install_codecarbon.sh"
                  language="bash"
                  onCopy={() => handleCopyToClipboard(installationCode)}
                  onDownload={() => handleDownloadFile(installationCode, "install_codecarbon.sh", "text/x-shellscript")}
                />

                <CodeBlock
                  code={requirementsContent}
                  filename="requirements.txt"
                  language="text"
                  onCopy={() => handleCopyToClipboard(requirementsContent)}
                  onDownload={() => handleDownloadFile(requirementsContent, "requirements.txt")}
                />

                <div className="space-y-2">
                  <h4 className="font-semibold">Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Python 3.7+</li>
                    <li>• Internet connection for API calls</li>
                    <li>• Valid Code Carbon API key</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Python API Usage</span>
              </CardTitle>
              <CardDescription>Track emissions using the Python API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CodeBlock
                  code={pythonExample}
                  filename="emissions_tracker_example.py"
                  language="python"
                  onCopy={() => handleCopyToClipboard(pythonExample)}
                  onDownload={() => handleDownloadFile(pythonExample, "emissions_tracker_example.py", "text/x-python")}
                />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Manual Control</Badge>
                  <Badge variant="outline">Flexible</Badge>
                  <Badge variant="outline">Detailed Metrics</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decorator">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Decorator Usage</span>
              </CardTitle>
              <CardDescription>Automatically track function emissions with decorators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CodeBlock
                  code={decoratorExample}
                  filename="decorator_example.py"
                  language="python"
                  onCopy={() => handleCopyToClipboard(decoratorExample)}
                  onDownload={() => handleDownloadFile(decoratorExample, "decorator_example.py", "text/x-python")}
                />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Automatic</Badge>
                  <Badge variant="outline">Clean Code</Badge>
                  <Badge variant="outline">Function-level</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cli">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5" />
                <span>CLI Usage</span>
              </CardTitle>
              <CardDescription>Track emissions for any command or script</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CodeBlock
                  code={cliExample}
                  filename="cli_monitoring.sh"
                  language="bash"
                  onCopy={() => handleCopyToClipboard(cliExample)}
                  onDownload={() => handleDownloadFile(cliExample, "cli_monitoring.sh", "text/x-shellscript")}
                />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Command Line</Badge>
                  <Badge variant="outline">Any Script</Badge>
                  <Badge variant="outline">Environment Variables</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuration File</span>
              </CardTitle>
              <CardDescription>Use a configuration file for consistent settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CodeBlock
                  code={configExample}
                  filename="codecarbon.config"
                  language="ini"
                  onCopy={() => handleCopyToClipboard(configExample)}
                  onDownload={() => handleDownloadFile(configExample, "codecarbon.config", "text/plain")}
                />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Configuration</Badge>
                  <Badge variant="outline">Consistent Settings</Badge>
                  <Badge variant="outline">Team Sharing</Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Place this file in your project root to automatically configure Code Carbon settings.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docker">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Docker Integration</span>
              </CardTitle>
              <CardDescription>Track emissions in containerized applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CodeBlock
                  code={dockerExample}
                  filename="Dockerfile"
                  language="dockerfile"
                  onCopy={() => handleCopyToClipboard(dockerExample)}
                  onDownload={() => handleDownloadFile(dockerExample, "Dockerfile", "text/plain")}
                />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Docker</Badge>
                  <Badge variant="outline">Containerized</Badge>
                  <Badge variant="outline">Production Ready</Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    Use this Dockerfile to create a container that automatically tracks emissions for your application.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>After setting up Code Carbon tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Download Examples</h4>
                <p className="text-sm text-gray-600">
                  Download the code examples and configuration files to get started quickly
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Start Tracking</h4>
                <p className="text-sm text-gray-600">
                  Add Code Carbon tracking to your development workflows and scripts
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Monitor Dashboard</h4>
                <p className="text-sm text-gray-600">
                  View real-time emissions data in the Code Carbon tab of your dashboard
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold">Optimize Code</h4>
                <p className="text-sm text-gray-600">
                  Use the insights to identify and optimize carbon-intensive code sections
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
