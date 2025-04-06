// const sdk = require('@modelcontextprotocol/sdk');
//@ts-ignore
// import { ClientSession, StdioServerParameters } from '@modelcontextprotocol/sdk';
// //@ts-ignore
// import { stdio_client } from '@modelcontextprotocol/sdk/dist/cjs/client/stdio';
// //@ts-ignore
// import { AsyncExitStack } from '@modelcontextprotocol/sdk/dist/cjs/utils/async_exit_stack';

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import mcpServers from '../config/mcpServers.json' assert { type: 'json' };

/**
 * MCP client for interacting with MCP servers
 */
export class MCPClient {
  private static clients: Record<string, Client> = {};
  private static transports: Record<string, StdioClientTransport> = {};

  /**
   * Get or create an MCP client for a server
   */
  private static async getClient(serverName: string): Promise<Client> {
    // Return existing client if already connected
    if (this.clients[serverName]) {
      return this.clients[serverName];
    }

    // Get server config
    const serverConfig = mcpServers[serverName as keyof typeof mcpServers];
    if (!serverConfig) {
      throw new Error(`MCP server "${serverName}" not found in configuration`);
    }

    console.log(`[MCP] Connecting to ${serverName} server`);

    // Create transport
    this.transports[serverName] = new StdioClientTransport({
      command: serverConfig.command,
      args: serverConfig.args,
    });

    // Create and connect client
    const client = new Client({ name: "jobseeker-mcp-client", version: "1.0.0" });
    await client.connect(this.transports[serverName]);

    // Store client for reuse
    this.clients[serverName] = client;

    return client;
  }

  /**
   * Execute a tool call on an MCP server
   */
  static async executeToolCall(
    serverName: string,
    toolName: string,
    args: any
  ): Promise<any> {
    try {
      // Get client
      const client = await this.getClient(serverName);

      // List available tools
      const toolsResult = await client.listTools();
      console.log(`[MCP] Available tools: ${toolsResult.tools.map(t => t.name).join(', ')}`);

      // Check if requested tool exists
      if (!toolsResult.tools.some(t => t.name === toolName)) {
        throw new Error(`Tool "${toolName}" not found in server "${serverName}"`);
      }

      // Call tool
      console.log(`[MCP] Executing tool "${toolName}" with args:`, args);
      const result = await client.callTool({
        name: toolName,
        arguments: args
      });

      return result.content;
    } catch (error) {
      console.error(`[MCP] Error executing tool "${toolName}":`, error);
      throw error;
    }
  }

  /**
   * Get available tools from an MCP server
   */
  static async getTools(serverName: string): Promise<any[]> {
    try {
      // Get client
      const client = await this.getClient(serverName);

      // List tools
      const toolsResult = await client.listTools();
      return toolsResult.tools;
    } catch (error) {
      console.error(`[MCP] Error getting tools from "${serverName}":`, error);
      throw error;
    }
  }

  /**
   * Close all connections
   */
  static async cleanup(): Promise<void> {
    for (const serverName in this.clients) {
      try {
        await this.clients[serverName].close();
        console.log(`[MCP] Disconnected from ${serverName} server`);
      } catch (error) {
        console.error(`[MCP] Error disconnecting from ${serverName}:`, error);
      }
    }
  }

  /**
   * List available tools from an MCP server
   */
  static async listAvailableTools(serverName: string): Promise<void> {
    const tools = await this.getTools(serverName);
    console.log(`Available tools for ${serverName}:`, tools.map(t => t.name));
  }
}

// Add cleanup on process exit
process.on('exit', () => {
  MCPClient.cleanup().catch(console.error);
});
