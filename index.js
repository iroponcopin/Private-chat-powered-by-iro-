const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { defineSecret } = require("firebase-functions/params");

admin.initializeApp();
const db = admin.firestore();

const ACCESS_KEY = defineSecret("ACCESS_KEY");

/**
 * Gatekeeper Function: verifyAccessKey
 * Verifies the shared password and returns a Custom Auth Token.
 */
exports.verifyAccessKey = onCall({ secrets: [ACCESS_KEY] }, async (request) => {
    const userPassword = request.data.password;
    const validPassword = ACCESS_KEY.value();

    if (userPassword !== validPassword) {
        // Audit failed attempt? Optional, but good for security monitoring.
        // For now, just reject.
        throw new HttpsError("permission-denied", "Invalid Access Key");
    }

    // Generate a random session ID or use a UUID for the session
    // We'll create a Firebase Custom Token. 
    // We can treat all users as one 'shared_user' UID effectively, or generate unique ephemeral UIDs.
    // Requirement says: "Assigns unique session identities." 
    // To distinguish in Auth, let's generate a random UID per session.
    const sessionUid = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const token = await admin.auth().createCustomToken(sessionUid, {
            role: 'participant'
        });
        return { token };
    } catch (error) {
        console.error("Error creating custom token:", error);
        throw new HttpsError("internal", "Unable to generate session token");
    }
});

/**
 * Audit Log Trigger: onMessageUpdate
 * Listens for Message Edits or Soft Deletes (Withdrawals) and logs them.
 */
exports.onMessageUpdate = onDocumentUpdated("messages/{messageId}", async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    const messageId = event.params.messageId;
    const now = admin.firestore.Timestamp.now();

    // Detect Withdrawal (Soft Delete)
    if (before.visible === true && after.visible === false) {
        await db.collection("audit_logs").add({
            event_type: "WITHDRAW",
            target_message_id: messageId,
            actor_uid: after.auth_uid,
            snapshot_data: {
                content: before.content,
                display_name: before.display_name
            },
            timestamp: now
        });
        return;
    }

    // Detect Content Edit
    if (before.content !== after.content && after.visible === true) {
        await db.collection("audit_logs").add({
            event_type: "EDIT",
            target_message_id: messageId,
            actor_uid: after.auth_uid,
            previous_content: before.content,
            new_content: after.content,
            timestamp: now
        });
    }
});
