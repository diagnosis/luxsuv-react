@@ .. @@
   },

+  // Reset password with token
+  resetPassword: async (resetData) => {
+    console.log('🔄 Reset Password API Call');
+    
+    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
+      method: 'POST',
+      headers: {
+        'Content-Type': 'application/json',
+      },
+      body: JSON.stringify(resetData),
+    });
+
+    console.log('📡 Reset Password Response Status:', response.status);
+    
+    if (!response.ok) {
+      const errorData = await response.json().catch(() => ({}));
+      console.error('❌ Reset Password Error Response:', errorData);
+      
+      const errorMessage = errorData.error || errorData.message || `Password reset failed with status ${response.status}`;
+      throw new Error(errorMessage);
+    }
+
+    const data = await response.json();
+    console.log('✅ Reset Password Success:', data);
+    return data;
+  },
+
   // Health check